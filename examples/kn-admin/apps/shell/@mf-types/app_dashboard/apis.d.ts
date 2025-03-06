
    export type RemoteKeys = 'app_dashboard/App';
    type PackageType<T> = T extends 'app_dashboard/App' ? typeof import('app_dashboard/App') :any;