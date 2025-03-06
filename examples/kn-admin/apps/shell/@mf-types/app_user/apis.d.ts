
    export type RemoteKeys = 'app_user/App';
    type PackageType<T> = T extends 'app_user/App' ? typeof import('app_user/App') :any;