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
import {
    Circolo
} from "./Circolo";
import {
    Interscambio
} from "./Interscambio";
import {
    Progressions
} from "./Progressions";

export function en() {
    return {
        App: App(),
        Item: Item(),
        List: List(),
        Login: Login(),
        SignUp: SignUp(),
        Config: Config(),
        Circolo: Circolo(),
        Interscambio: Interscambio(),
        Progressions: Progressions(),

    };
}