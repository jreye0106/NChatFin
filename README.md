# NChat
NChat is a secure, modern messaging application designed with a clean UI, real‑time communication, and strong encryption.

Project Overview
NChat is built around four major components:

Frontend (Mobile App)  
Handles all user interactions, screens, navigation, and API communication.

Backend API  
Manages authentication, messaging logic, friend system, and communication with the database.

Database Layer  
Stores user profiles, messages, contacts, friend requests, and encryption keys.

Security & Encryption Layer  
Ensures end‑to‑end encryption, secure key exchange, and safe data handling.

DevOps & Deployment  
Handles CI/CD, cloud infrastructure, monitoring, and production deployment.

Technology Stack 
Frontend:

React Native or Flutter
State management (Redux, Zustand, Provider)
Firebase Cloud Messaging (notifications)

Backend:

Node.js (Express) or Python (FastAPI)
WebSockets for real‑time messaging
JWT authentication
REST or GraphQL API

Database:

MongoDB Atlas or PostgreSQL
Redis for caching

Security:

AES‑256 for message encryption
RSA or Diffie‑Hellman for key exchange
Secure key storage (Keychain / Android Keystore)

DevOps:

GitHub + GitHub Actions
Docker
AWS or Azure
NGINX reverse proxy
Monitoring (Grafana, Prometheus, Sentry)

Branch Structure 

-main : production ready code only
-dev : integration branch . all features merge here after review 
- feature/frontend=\* : all frontend tasks
- feature/backend-\* : backend endpoints , message logic , friend system
- feature/devops-\* : CI/CD , Docker , Infrastructure files
- hotfix/\* : urgent fixes only

NO ONE pushes directly to main or dev , all changes must go through pull requests 

Workflow (IMPORTANT) 
1. Each team memeber writes their code in their own feature branches
2. Whena feature is complete , they open a pull request into dev
3. DevOps reveiws the code and checks for conflicts / runs automated tests
4. if approved , it will merge into dev
5. when milestones are completed they will be pushed into main
6. DevOps deploys main branch to production

--------------------------------------

RESPONSIBILITIES AND CHECKLIST BY ROLE 

Frontend Developer :
-Login, signup , verfication , and profile setup screens 
-Chat list , chat view , message input , message bubbles 
-disvocer tab , mutuals, contacts , friend requests 
-Profile screen, edit profile , settings 
-Navigation between all screens 
-API calls to backend (login, send messages , fetch chats , add friend , block user) 
-Local state management 
-Push notifications 
-Error states , load states , UI validation 

Checklist: 
[] Build all UI screens 
[] Implement navigation
[] Connect to backend API
[] Manage app state 
[] Handle notifications
[] Add loading/error states 
[] Test on IOS and Andriod 

-----------------------------------

Encryption & Security Engineer :
-key generation and key exchange functions 
-Message encryption and decryption functions 
-Secure key storage on device 
-Authentication logic(JWT handling , token refresh) 
-Security middleware for backend 
-Vulnerability testing scripts 
-Block/report/privacy logic 

Checklist: 
[] Implement key generation 
[] Implement key exchange 
[] Encrypt ougoing messages 
[] Decrypt incoming messages 
[] Securely store keys 
[] Add authentication middleware 
[] Run vulnerability tests 

---------------------------------

Backend & Database Engineer : 
-API endpoints for login, register, send message, fetch message 
-Friend system (add, accept, decline, block , remove)
-Discover System(mutuals, suggested contacts) 
-Database schema for users , messaging, contacts , keys 
-Real time messaging(WebSockets or polling)
-Rate limiting , logging and error handling 
-Media upload endpoints 

Checklist: 
[] Build all API endpoints 
[] Create database schema 
[] Implement real time messaging 
[] Add friend system logic 
[] Add discover/mutuals logic 
[] Add logging and rate limiting 
[] Test all endpoints with postman 

------------------------------------

DevOps Engineer : 
-CICD pipelines using github actions 
-Docker containers for backend and frontend builds
-Cloud infrastructure (AWS or Azure)
-Environment variable and secret management 
-Monitoring dashboards
-Backup and recovery processes 
-Branch protection rules 
-Automated testing triggers 

Checklist: 
[] Create Github Actions CI/CD
[] Build Docker images 
[] Deploy backend to cloud 
[] Setup environment variables 
[] Configure monitoring 
[] Setup backups 
[] Enforce branch protection rules 
