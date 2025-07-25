FROM node:18-alpine

WORKDIR /app

# install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# copy source
COPY . .

EXPOSE 5000
CMD ["node", "src/index.js"]