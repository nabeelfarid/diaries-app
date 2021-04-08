import {
  createServer,
  Model,
  Request,
  Response,
  Registry,
  hasMany,
  belongsTo,
  Factory,
  JSONAPISerializer,
  Serializer,
  Server,
} from "miragejs";
import { ModelDefinition } from "miragejs/-types";

import Schema from "miragejs/orm/schema";
import { SerializerInterface } from "miragejs/serializer";

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
          return `Diary ${i}`;
        },
      }),
      entry: Factory.extend({
        title(i: number) {
          return `Entry ${i}`;
        },
      }),
    },

    seeds: (server) => {
      let user = server.create("user");
      let diaries = server.createList("diary", 2, {
        user,
        subtitle: "some subtitle",
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
      this.get("/diaries", (schema: any) => {
        return schema.users.find(1).diaries;
      });

      //Get diary by id
      this.get("/diaries/:id", (schema: any, request: Request) => {
        let id = request.params.id;
        return schema.diaries.find(id);
      });

      //Create new Diary
      this.post("/diaries", (schema: any, request: Request) => {
        let attrs = JSON.parse(request.requestBody);
        let newDiary = schema.users.find(1).createDiary({
          ...attrs,
          created: Date.now(),
          updated: Date.now(),
        });
        return newDiary;
      });

      //Update Diary
      this.put("/diaries/:id", (schema: any, request: Request) => {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        let diary = schema.diaries.find(id);
        diary.update({
          ...attrs,
          updated: Date.now(),
        });
        return diary;
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

      //get entry by id
      this.get("/diaries/entries/:id", (schema: any, request: Request) => {
        let id = request.params.id;
        return schema.entries.find(id);
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
