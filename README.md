
### Setup Instructions
1. **Prerequisites**:
   - Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).
   - Ensure port 80 is free on your machine.

2. **Steps**:
   - Clone the repository: `git clone <repository-url>`.
   - Navigate to the project directory: `cd fullstack-todo-list`.
   - Build and run the containers: `docker-compose up --build`.
   - Open your browser to `http://localhost`.
   - Stop the containers: `docker-compose down` (add `-v` to remove the database volume).

### Configuration Notes
- **Network**: Services communicate over a default Docker network. The frontend proxies `/api/` to `backend:5000`.
- **Ports**: Only port 80 (frontend) is exposed to the host.
- **Backend**: Must use the environment variables (`DB_HOST`, `DB_USER`, etc.) to connect to the database. Update your backend code if needed (e.g., `mongodb://root:password@database:27017/todolist`).
- **Security**: Use stronger credentials in production.

### Troubleshooting
- **Application not loading**: Check container status with `docker-compose ps`.
- **Backend issues**: View logs with `docker-compose logs backend`.
- **Frontend issues**: Check logs with `docker-compose logs frontend`.

### To run test on Windows 
`test-containers.bat`


### To run test on Linux/Mac
`./test-containers.sh`