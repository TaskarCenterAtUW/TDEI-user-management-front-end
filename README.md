# TDEI-user-management-web

This repo holds the code for TDEI User Management front end application. The app is written in React
The app uses the APIs defined in https://github.com/TaskarCenterAtUW/TDEI-user-management-ts (backend application for user management)

## For local development

- Go to tdei-ui folder
- Do npm install
- Do npm start
- Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## For production build

- Go to tdei-ui folder
- Do npm install
- Do npm run build
- This will builds the app for production to the `build` folder.

## Environment Variables

```shell
REACT_APP_URL = <User management backend URL>
REACT_APP_MAP_KEY = <Map API Key for mapbox>
REACT_APP_OSM_URL = <gateway URL for TDEI APIs>
REACT_APP_ADMIN_EMAIL = <Admin email>
REACT_APP_TDEI_WORKSPACE_URL = <TDEI Workspace URL>
```

## Deployment

When a pull request (PR) is merged, the application is automatically deployed based on the target branch:

- **`dev` branch**: Deploys the application to the **Development** environment.
- **`stage` branch**: Deploys the application to the **Staging** environment.
- **`main` branch**: Deploys the application to the **Production** environment.

Deployment workflows are managed via GitHub Actions, defined within the `.github/workflows` directory.


## For changing brand color and font

- Go to /tdei-ui/src/index.css
- Colors: Find --primary-color defined in the root.  Adjust --primary-color and other relative shades.
- Font: Import font family. Find --primary-font-family defined in the root and change the font name for primary and secondary font.  