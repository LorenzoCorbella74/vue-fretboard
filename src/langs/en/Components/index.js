import {
    Item
} from "./Item";
import {
    List
} from "./List";
import {
    Login
} from "./Login";
import {
    SignUp
} from "./SignUp";
import {
    App
} from "./App";

export function en() {
    return {
        App: App(),
        Item: Item(),
        List: List(),
        Login: Login(),
        SignUp: SignUp(),
    };
}