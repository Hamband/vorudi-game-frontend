<template>
    <b-container class="login">
        <h1>لطفا وارد شوید.</h1>
        <b-form @submit="doLogin">
            <b-form-group
                    id="username-input-group"
                    label="نام کاربری:"
                    label-for="username"
                    description="نام کاربری‌ای که در بازی به تیم شما داده‌شده است را در زیر وارد کنید."
            >
                <b-form-input type="text" id="username" v-model="username" placeholder="نام کاربری"></b-form-input>
            </b-form-group>
            <b-form-group
                    id="password-input-group"
                    label="رمز عبور:"
                    label-for="passowrd"
                    description="رمزعبوری که در بازی به تیم شما داده‌شده است را در زیر وارد کنید."
            >
                <b-form-input type="password" id="password" v-model="password" placeholder="رمز"></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary" block>ورود</b-button>

        </b-form>
    </b-container>
</template>

<script>
    import {siteUrl} from "../const";

    export default {
        name: 'Login',
        data() {
            return {
                'username': '',
                'password': '',
                'message': ''
            }
        },
        props: {},
        methods: {
            doLogin(event) {
                event.preventDefault();
                fetch(siteUrl + '/auth/login', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify({
                        'username': this.username,
                        'password': this.password
                    })
                }).then(x => x.json())
                    .then(data => {
                        if (data.token) {
                            this.$bvToast.toast('شما با موفقیت وارد شدید.', {
                                variant: 'success',
                                solid: true
                            });

                            localStorage.setItem('login', data.token);
                            this.$router.push('/');
                        } else {
                            this.$bvToast.toast('نام کاربری یا رمز عبور غلط است', {
                                variant: 'danger',
                                solid: true
                            });
                        }
                    })
            }
        }
    }
</script>

<style>
    .login, input {
        font-family: Yekan;
    }
</style>
