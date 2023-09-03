resource "aws_iam_role" "pretend_cross_access" {
  name = "pretend-cross-access"
  path = "/"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = ["sts:AssumeRole"],
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::883979811993:user/${var.main_runner}"
        }
    }]
  })

  inline_policy {
    name = "assume-elasticache-role"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = {
        Action   = "sts:AssumeRole"
        Effect   = "Allow"
        Resource = "arn:aws:iam::883979811993:role/cache_role"
      }
    })
  }
}
resource "aws_iam_role" "elasticache" {
  name = "cache-role"
  path = "/"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = ["sts:AssumeRole"],
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::883979811993:role/pretend-cross-access" // this account has assume_role_policy set for local-dev user
        }
    }]
  })

  inline_policy {
    name = "cache-iam-auth"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action = ["elasticache:Connect"]
          Effect = "Allow"
          Resource = [
            aws_elasticache_replication_group.this.arn,
            aws_elasticache_user.user.arn
          ]
        }
      ]
    })
  }
  depends_on = [aws_iam_role.pretend_cross_access]
}

resource "aws_elasticache_user" "user" {
  access_string = "on ~* +@all"
  engine        = "REDIS"
  user_id       = "user-01"
  user_name     = "user-01"

  authentication_mode {
    type = "iam"
  }
}

resource "aws_elasticache_user_group" "this" {
  engine        = "REDIS"
  user_group_id = "user-group-alpha"
  user_ids      = [aws_elasticache_user.user.id, aws_elasticache_user.basic_user.id, "default"]
}

resource "aws_elasticache_user" "basic_user" {
  user_id       = "testuser"
  user_name     = "testuser"
  access_string = "on ~* +@all"
  engine        = "REDIS"
  passwords     = [var.demo_user_password] // For demo, specifying password is not recommended for real use cases.
}
