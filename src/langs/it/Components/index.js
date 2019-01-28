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
import {
    Config
} from "./Config";

export function it() {
    return {
        App: App(),
        Item: Item(),
        List: List(),
        Login: Login(),
        SignUp: SignUp(),
        Config: Config(),
    };
}