FROM node:16-alpine
WORKDIR /test
RUN ["apk", "add", "git"]
COPY package*.json ./
RUN ["npm", "install"]
COPY . .
CMD ["npx", ".", "test_api"]