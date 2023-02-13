FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3001

EXPOSE 3001

RUN npm run build --production

RUN npm install -g serve

EXPOSE 3001

CMD serve -s build