## Rifamax Front-End

<p align="center">
  <img src="https://rifa-max.com/logo-rifamax.png" />
</p>

Rifamax is a raffle management system that allows the creation, sale, and management of raffles for the lasts 5 days. This system has a raffle module that consists of 3 phases: Raffle Creation, Sending to the APP, and Ticket Sales. Additionally, it has administrative modules such as user management, raffle management, agency management, and wallet management.

The system uses [TypeScript](https://www.typescriptlang.org/) language and the primary library used is [React](https://beta.reactjs.org/) with [Vite](https://vitejs.dev/). Rifamax uses JSON Web Token ([JWT](https://jwt.io/)) for authentication and Role-Based Authentication to manage permissions. The entire system is managed by an administrator user that has access to all the features of the system.

To manage UI we are using [Mantine UI](https://mantine.dev/) and [Redux](https://es.redux.js.org/) to manage states, to improve perfomance of system and perform sync and async actions we are using [RxJs](https://rxjs.dev/).

<p align="center">
  <img src="https://i.imgur.com/2WOWP2C.png" width="80%"/>
</p>

## How to Compile the Project
To compile the project, follow these steps below:

1. Clone the repository
```bash
git clone https://github.com/Dataweb-C-A/cda-frontend
```

2. Install Dependencies (We recommend to use [PNPM](https://pnpm.io/es/))

```bash
npm install
```

3. Run project
  - Run in Developer mode
  ```bash
  npm run dev
  ```
  
  - In Production mode
    - Build project
    ```bash
    npm run build
    ```
    
    - Run build
    ```bash
    npm run start
    ```
    
By following these steps, you can compile and run the Rifamax system on your local machine. Enjoy your raffle management experience!
