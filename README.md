# Getting Started

### Clone the Repository:  
Run the following command to clone the repository and navigate into it: 
```sh
git clone https://github.com/quocvietpham185/test_Docker.git && cd your-repository
```
### Install Dependencies:
Before running the application, make sure to install all the required dependencies using the following command:
```sh
npm install
```
### Start the Application:
To start the application locally, use the following command:
```sh
npm start
```
This will start the server on the default port (e.g., 3000).

### Build the Docker Image:  
Build the Docker image using the following command:
```sh
docker build -t test_docker .
```
### Run the Container:  
Run the container with the specified port mapping:
```sh
docker run -d -p 3000:3000 --name my_postgres postgres
```
(Replace `3000:3000` with the appropriate ports if your application runs on a different port.)  

### Access the Application:  
Once the container is running, open your browser and go to:
**http://localhost:3000**  

### Using Docker Compose (Optional):  
If your project requires multiple services (e.g., database, backend, frontend), use `docker-compose.yml`  
- Start services:
```sh
docker-compose up -d
```  
- Stop services:
```sh
docker-compose down  
```
### Managing the Container:  
- List running containers:
```sh
docker ps
```  
- Stop container:
```sh
docker stop your-container-name
```  
- Delete container:
```sh
docker rm your-container-name 
```
### Environment Variables:  
If your application requires environment variables, create a `.env` file:  
```sh
cp .env.example .env
```
Modify the .env file as needed before running the container.

### Troubleshooting:  
- View logs:
```sh
docker logs your-container-name
```  
- Restart container:
```sh
docker restart your-container-name
```  

