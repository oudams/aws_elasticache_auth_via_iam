# AWS Elasticache Authentication Via IAM Node.js (Redis)


With IAM Authentication you can authenticate a connection to ElastiCache for Redis using AWS IAM identities, when your cluster is configured to use Redis version 7 or above.

In the official doc, AWS demonstrates this method on Java, using Lettuce Redis Client.

This repo will demonstrate the same for a simple Node.JS app.

# Use case

- Create an Elasticache cluster, with an "elasticache user" with authentication mode set to "iam". 
- Create a role so a client can assume and obtain a AccessID and AccessKey.
- The Client generate a signed URI using the AccessID, AccessKey, the cluster endpoint, and Elasticache user with Signature V 4. https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-signing.html
- Using the signed URI, the Client can use a Redis client with Node.JS https://redis.io/docs/clients/nodejs/ to connect to the cluster endpoint.

# Connecting Requirements
We can simply connect the client from an allowed EC2 instance. Or use VPN to connect to a VPN endpoint to connect to a private cache.

# Infra
for simplicity, we can use community Terraform modules to create resources. I'm using CloudPose modules.
- A VPC
- A Subnet, Public and Private
- Elasticache
- IAM Role
- Elasticache User, and User group
- VPN Client Endpoint

# Node App
Simple Node.JS app to connect to Redis Elasticache and authenticate using IAM. Validate that multi and exec command works.


