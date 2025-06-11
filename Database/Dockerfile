FROM mongo:latest

# Create app directory for custom scripts/configs
WORKDIR /docker-entrypoint-initdb.d/

# Expose the default MongoDB port
EXPOSE 27017

# Set default command
CMD ["mongod"]