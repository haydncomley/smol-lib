import {
    component,
    element,
    render,

    value,
    sharedValue,
    compute,
    provide,
    consume,

    listen,
    bind,
    input,
} from "./smol/index.js";

component('my-app', () => {
    const age = value(12);
    provide('age', age);
    input('[data-persist="test"]', age);

    return render`
        <div>
            This is my app :: ${age}
            <my-thing></my-thing>
            <input data-persist="test"></input>
        </div>
    `
});

component('my-thing', () => {
    const age = consume('age');

    const computedAge = compute(() => {
        return `The age is: ${age.get()}`
    }, [age]);

    const ageValidation = compute(() => {
        return !parseInt(age.get()) ? 'Invalid' : 'Valid';
    }, [age]);

    return render`
        <span>
            <div>${computedAge}</div>
            <div>Is Valid Number? ${ageValidation}</div>
            Child Consumer :: ${age}
        </span>
    `
});

component('my-input', () => {
    const user = sharedValue('user', { name: 'Haydn' });

    const nameInput = value(user.get().name);

    input('input', nameInput, () => {
        user.set({ name: nameInput.get() })
    });


    const transformedName = compute(() => {
        return `The Name: ${user.get().name}`;
    }, [user]);

    return render`
    <p>${transformedName}</p>
    <input type="text" data-persist="my-input"></input>
    `;
})

component('my-button', () => {
    const rootElement = element();
    const count = value(0);
    const sharedCount = sharedValue('counter', 0);
    const user = sharedValue('user', { name: 'Haydn' });
    
    compute(() => {
        rootElement.querySelector('button').addEventListener('click', () => {
            count.set(count.get() + 1);
            sharedCount.set(sharedCount.get() + 1);
            user.set({ name: 'Haydn' })
        });
    });

    const combined = compute(() => {
        return count.get() + sharedCount.get();
    }, [count, sharedCount, count]);

    return render`<button>Value L:${count} S:${sharedCount} C:${combined}</button>`;
})

component('my-nested-button', () => {
    const button = element();
    const count = value(0);
    const user = sharedValue('user', { name: 'Haydn' });

    const userName = compute(() => {
        console.log('Compute Name')
        return user.get().name;
    }, [user]);
    
    compute(() => {
        console.log('Compute OnClick');
        button.querySelector('div>button').addEventListener('click', () => {
            console.log('Click!', count.get());
            count.set(count.get() + 1);
        });
    });


    return render`
        <div>
            <p>Hello ${userName}</p>
            <button>Another ${count}</button>
            <my-button></my-button>
        </div>
    `;
})