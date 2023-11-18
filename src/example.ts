import { component } from "./r/component";
import { render } from "./r/rendering";
import { compute, value } from "./r/state";

component('my-component', () => {
    const count = value(0);
    const countTimesTen = compute(() => count.get() * 10, [count]);

    render`Hello! ${count} * 10 = ${countTimesTen}`;
});