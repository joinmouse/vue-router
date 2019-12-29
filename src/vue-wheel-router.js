import Vue from 'vue';

// 导出的源码
export default class VueRouter {
    constructor({ routes }) {
        this.routes = routes;
        this.history = new History();
        this.path = window.location.hash;
        this.history.listen((path) => {
            console.log('vm:', this.vm)
            this.path = path
            console.log('变化的path', path)
            // https://cn.vuejs.org/v2/api/#vm-forceUpdate, 迫使Vue实例组件重新渲染
            this.vm.$forceUpdate()
        })
    }
    init(vm) {
        this.vm = vm
    }
}

// 监听路由变化
class History {
    listen(callback) {
        window.addEventListener('hashchange', function() {
            console.log('hash-change', window.location.hash)
            callback && callback(this.window.location.hash)
        })
    }
}

VueRouter.install = function (Vue) {
    Vue.mixin({
        beforeCreate() {
            if(this.$options.router) {
                this.$options.router.init(this)
            }
        }
    })

    //router-view
    Vue.component('router-view', {
        functional: true,
        render(createElement, {props, children, parent, data}) {
            // 找到path
            const router = parent.$options.router;
            const path = router.path;

            console.log(router, path)

            const matchRoute = router.routes.find(route => {
                return route.path.replace(/^\//, '') === path.replace(/^#\//, '')
            })
            console.log('重新刷了一下，要更换组件了', router)
            return createElement(
                'div'
            )
        }
    })
}
