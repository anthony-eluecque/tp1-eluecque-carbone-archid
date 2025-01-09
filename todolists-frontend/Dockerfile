# Build step
FROM node:18-alpine AS build
WORKDIR /app
COPY ./backend/api-client ./backend/api-client
COPY ./todolists-frontend ./todolists-frontend

WORKDIR /app/todolists-frontend
RUN npm install
RUN npm run build
CMD ["npm", "start"]
