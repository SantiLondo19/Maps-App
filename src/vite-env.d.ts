/// <reference types="vite/client" />
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_MAP_TOKEN: string;
        }
    }
}