
export interface IUser{
    name:string,
    email:string,
    password:string,
    refreshToken?:string  // user logged in hai --> to pane pass refresh token hoga wrna nhi so optional bna do simple
    task?:string[] , 
}