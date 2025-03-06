Getting Started

1. Clone the Repository

git clone https://github.com/quocvietpham185/test_Docker.git
cd your-repository

2. Build the Docker Image

docker build -t test_docker .

3. Run the Container

docker run -d -p 3000:3000 --name my_postgres postgres

Replace 3000:3000 with the appropriate ports if your application runs on a different port.

4. Access the Application

Once the container is running, access the application via:

http://localhost:3000

Using Docker Compose (Optional)

If your project requires multiple services (e.g., database, backend, frontend), use docker-compose.yml.

1. Start the Services

docker-compose up -d

2. Stop the Services

docker-compose down

Managing the Container

Check running containers:

docker ps

Stop the container:

docker stop your-container-name

Remove the container:

docker rm your-container-name

Environment Variables

If your application requires environment variables, create a .env file and add necessary configurations.

cp .env.example .env

Modify the .env file as needed before running the container.

Troubleshooting

Check logs:

docker logs your-container-name

Restart the container:

docker restart your-container-name

License

This project is licensed under the MIT License.

Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.
