# MLDS UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.2.

## Development server

First run `npm install` to install all relevant package dependencies.

Then run `ng serve` for a dev server. The default port for the development server can be found at `http://localhost:4200/`.

## Additional Configuration

Depending on how your infrastructure is set up, the following example nginx configuration may be of assistance. This will allow you to connect to SNOMED International development environment (auth required), in order to connect with relevant REST API's:

```
server {
        listen      8080;
        server_name localhost.ihtsdotools.org;
        location / {
            proxy_pass http://127.0.0.1:4200;
        }
        location /browser {
           proxy_pass https://dev-snowstorm.ihtsdotools.org/snowstorm/snomed-ct;
        }
        location /snowstorm {
           proxy_pass https://dev-snowstorm.ihtsdotools.org/snowstorm;
        }
        location /auth {
            proxy_pass https://dev-ims.ihtsdotools.org/api/account;
            proxy_set_header Accept "application/json";
        }
    }
```
Using local.ihtsdotools validates the IMS SSO cookie against the subdomain.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

Tip: `ng g c component-name` is a short form way to run the same command.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
