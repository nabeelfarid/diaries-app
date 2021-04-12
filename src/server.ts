import {
  createServer,
  Model,
  Request,
  Response,
  hasMany,
  belongsTo,
  Factory,
  Serializer,
} from "miragejs";

import * as faker from "faker";

const ApplicationSerializer = Serializer.extend({
  // will always serialize the ids of all relationships for the model or collection in the response
  serializeIds: "always",
});

const MakeServer = ({ environment = "test" } = {}) => {
  let server = createServer({
    environment,

    serializers: {
      application: ApplicationSerializer,

      // diary: ApplicationSerializer.extend({
      //   // serializeIds: "always",
      //   // include: ["entries"],
      // }),
    },
    models: {
      user: Model.extend({
        diaries: hasMany("diary"),
      }),
      diary: Model.extend({
        entries: hasMany("entry"),
        user: belongsTo("user"),
      }),
      entry: Model.extend({
        diary: belongsTo("diary"),
      }),
    },

    factories: {
      user: Factory.extend({
        username: "tester",
        password: "password",
        email: "tester@gmail.com",
      }),

      diary: Factory.extend({
        title(i: number) {
          return faker.random.words(3);
        },
        subtitle(i: number) {
          return faker.random.words(5);
        },
        isPublic(i: number) {
          return Math.random() - 0.5 > 0 ? true : false;
        },
        created() {
          //set created date between last 30 days
          var start = new Date();
          var end = new Date();
          start.setDate(end.getDate() - 30);
          return faker.date.between(start, end).getTime();
        },
        updated() {
          //set updated date between created date and now
          var start = new Date(Number(this.created));
          var end = new Date();

          return faker.date.between(start, end).getTime();
        },
      }),
      entry: Factory.extend({
        title(i: number) {
          return faker.random.words(3);
        },
        content(i: number) {
          return faker.lorem.paragraphs(2);
        },
        created() {
          //set created date between last 30 days
          var start = new Date();
          var end = new Date();
          start.setDate(end.getDate() - 30);
          return faker.date.between(start, end).getTime();
        },
        updated() {
          //set updated date between created date and now
          var start = new Date(Number(this.created));
          var end = new Date();

          return faker.date.between(start, end).getTime();
        },
      }),
    },

    seeds: (server) => {
      let user = server.create("user");
      let diaries = server.createList("diary", 10, {
        user,
        // subtitle: "some subtitle",
        // entries: server.createList("entry",2),
      });
      diaries.forEach((diary) => {
        server.createList("entry", 2, { diary: diary });
      });
    },

    routes: function () {
      this.namespace = "api";

      this.post("/login", (schema: any, request: Request) => {
        let { username, password } = JSON.parse(request.requestBody);
        let user = schema.users.findBy({ username, password });
        if (user) {
          return { token: "some token", ...user.attrs };
        } else {
          return handleErrors({
            code: 401,
            message: "Authentication failed: Incorrect username or password",
          });
        }
      });

      this.post("/signup", (schema: any, request: Request) => {
        let data = JSON.parse(request.requestBody);
        let xUser = schema.users.findBy({ username: data.username });
        if (xUser) {
          return handleErrors({
            code: 401,
            message: "Username already taken. Chose a different username.",
          });
        }
        let user = schema.users.create({
          username: data.username,
          password: data.password,
          email: data.email,
        });
        return { token: "some token", ...user.attrs };
      });

      //Get User Diaries
      this.get("/user/:id/diaries", (schema: any, request: Request) => {
        let id = request.params.id;
        return schema.diaries.where({ userId: id });
      });

      //Get diary by id
      this.get("/diaries/:id", (schema: any, request: Request) => {
        let id = request.params.id;
        let diary = schema.diaries.find(id);
        if (diary) {
          return diary;
        } else {
          return handleErrors({
            message: `Diary with id (${id}) does not exist`,
          });
        }
      });

      //Create new Diary
      this.post("/diaries", (schema: any, request: Request) => {
        try {
          let attrs = JSON.parse(request.requestBody);
          let newDiary = schema.users.find(attrs.userId).createDiary({
            ...attrs,
            created: Date.now(),
            updated: Date.now(),
          });
          return newDiary;
        } catch (error) {
          return handleErrors({ error, message: "Failed to create Diary." });
        }
      });

      //Update Diary
      this.put("/diaries/:id", (schema: any, request: Request) => {
        try {
          let id = request.params.id;
          let attrs = JSON.parse(request.requestBody);
          let diary = schema.diaries.find(id);
          diary.update({
            ...attrs,
            updated: Date.now(),
          });
          return diary;
        } catch (error) {
          return handleErrors({ error, message: "Failed to update Diary." });
        }
      });

      //Delete Diary
      this.del("/diaries/:id", (schema: any, request: Request) => {
        let id = request.params.id;
        let diary = schema.diaries.find(id);
        diary.destroy();
        return diary;
      });

      //Get diary entries
      this.get("/diaries/:id/entries", (schema: any, request: Request) => {
        let id = request.params.id;
        return schema.entries.where({ diaryId: id });
      });

      //Create new entry
      this.post("/entries", (schema: any, request: Request) => {
        try {
          let attrs = JSON.parse(request.requestBody);
          let diary = schema.diaries.find(attrs.diaryId);
          let newEntry = diary.createEntry({
            ...attrs,
            created: Date.now(),
            updated: Date.now(),
          });
          diary.update({
            updated: newEntry.updated,
          });
          return newEntry;
        } catch (error) {
          return handleErrors({ error, message: "Failed to create Entry." });
        }
      });

      //Update Entry
      this.put("/entries/:id", (schema: any, request: Request) => {
        try {
          let id = request.params.id;
          let attrs = JSON.parse(request.requestBody);
          let entry = schema.entries.find(id);
          let diary = schema.diaries.find(entry.diaryId);
          entry.update({
            ...attrs,
            updated: Date.now(),
          });
          diary.update({
            updated: entry.updated,
          });
          return entry;
        } catch (error) {
          return handleErrors({ error, message: "Failed to update Entry." });
        }
      });
    },
  });

  return server;
};

const handleErrors = ({
  code = 400,
  error = null,
  message = "An error ocurred",
}: {
  code?: number;
  error?: any;
  message?: string;
}) => {
  if (error) {
    console.error("Mirage Server Error: ", error);
  }
  return new Response(code, undefined, {
    // errors: [message],

    message,
    isError: true,
  });
};

export default MakeServer;
