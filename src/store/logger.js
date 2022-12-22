function logger(reducer) {
    return (prevState, action) => {
        console.group(action.type);

        const nextState = reducer(prevState, action);
        console.groupEnd();
        return nextState;
    }
}
export default logger;