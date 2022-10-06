import Home from '../pages/Home'
import Category from '../pages/Category'
// import Statistical from '../pages/Statistical'
const publicRoutes = [
    {
        path:'/',
        component: Home
    },
    {
        path: '/category',
        component: Category
    },
    // {
    //     path: '/statistical',
    //     component: Statistical
    // }
]

const privateRoutes = [

]

export {publicRoutes,privateRoutes}