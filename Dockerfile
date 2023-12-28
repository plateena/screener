FROM node:14

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:v1.40.1-jammy

WORKDIR /app

COPY ./src/app ./

RUN npm install

CMD ["node", "app.js"]
