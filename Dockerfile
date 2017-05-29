# For building the image: docker build -t [IMAGE_NAME] .

# Use official node image
FROM node:7.10

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Set up node dependencies directory as volume to avoid overwriting
VOLUME /usr/src/app/node_modules

CMD [ "npm", "run", "dev" ]

# Expose server port
EXPOSE 8080
