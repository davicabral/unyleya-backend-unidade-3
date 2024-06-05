FROM node:18.6.0-alpine3.15
ENV PORT=3333
ENV MONGO_URI=mongodb+srv://unyleya:PaBeXXrAi1xwEu9t@urls-db.hgqmgx7.mongodb.net/?retryWrites=true&w=majority&appName=urls-db
ENV BASE=http://localhost:3333
RUN addgroup app && adduser -S -G app app
USER app
WORKDIR /app
COPY --chown=app:node package*.json .
RUN npm install
COPY --chown=app:node . .
EXPOSE 3333

# Exec form
CMD ["npm", "start"]