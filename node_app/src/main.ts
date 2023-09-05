import {redisConnect} from "./redisConnect.js";
import dotenv from 'dotenv';
dotenv.config();


await redisConnect();
