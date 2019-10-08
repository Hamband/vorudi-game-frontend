<template>
    <b-container>
        <h1 :style="{textAlign:'center'}">بازی جشن!</h1>
        <br>
        <User :user="user"/>
        <CurrentProblem :problem="user.current_problem" :hint="user.hint" @submit="submit_solution"
                        @get_hint="get_hint"/>
        <b-button block v-b-modal.modal-new-problem>
            <span v-if="user.current_problem">
                بیخیال شدن سوال کنونی و
            </span>
            سوال جدید
        </b-button>
        <b-button block v-b-modal.modal-reward-code>
            ارسال کد جایزه
        </b-button>
        <b-button block to="/scoreboard">
            رتبه‌بندی
        </b-button>
        <b-button variant="danger" block @click="logout">
            خروج
        </b-button>
        <b-modal id="modal-new-problem" title="سوال جدید" hide-footer>
            <p class="my-4">
                دسته‌بندی سوال را انتخاب کنید:
                <b-form @submit="new_problem">
                    <b-form-select v-model="selected_category" :options="categories" required>
                    </b-form-select>
                    <b-button type="submit" block>
                        سوال جدید
                    </b-button>
                </b-form>
            </p>
        </b-modal>
        <b-modal id="modal-reward-code" title="ارسال کد جایزه" hide-footer>
            <p class="my-4">
                کد جایزه را وارد کنید:
                <b-form @submit="get_reward">
                    <b-form-input v-model="reward_code" required>
                    </b-form-input>
                    <b-button type="submit" block>
                        ارسال
                    </b-button>
                </b-form>
            </p>
        </b-modal>
    </b-container>

</template>

<script>
    import User from './components/User.vue'
    import {siteUrl} from "./const";
    import CurrentProblem from "./components/CurrentProblem.vue";

    export default {
        name: 'app',
        components: {
            User,
            CurrentProblem,
        },
        data() {
            return {
                user: {
                    current_problem: null,
                    hint: false,
                    team_members: ''
                },
                categories: [],
                selected_category: '',
                reward_code: '',
            }
        },
        created() {
            this.get_user();
            fetch(siteUrl + '/problem/categories', {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem('login')
                },
                'method': 'GET'
            }).then(x => x.json())
                .then(data => {
                    const categories = [];
                    for (let category of data.categories) {
                        categories.push({
                            value: category.id,
                            text: `${category.name}
                             |
                            جایزه حل سوال:
                            ${category.accept_point}
                             |
                            هزینه ارسال غلط:
                            ${category.reject_point}
                             |
                            هزینه بیخیال شدن:
                            ${category.skip_point}
                             |
                            هزینه گرفتن راهنمایی:
                            ${category.hint_point}`
                        })
                    }
                    this.categories = categories;
                })
        },
        methods: {
            get_user() {
                fetch(siteUrl + '/auth/get', {
                    headers: {
                        'Authorization': 'Token ' + localStorage.getItem('login')
                    },
                    'method': 'GET'
                }).then(x => x.json())
                    .then(data => {
                        if (data.result !== 'user') {
                            localStorage.removeItem('login');
                            this.$router.push('/login');
                        } else {
                            this.user = data.user;
                        }
                    })
            },
            new_problem(event) {
                event.preventDefault();
                fetch(siteUrl + '/problem/new', {
                    headers: {
                        'Authorization': 'Token ' + localStorage.getItem('login'),
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify({
                        'category': this.selected_category
                    }),
                    method: 'POST',
                }).then(x => x.json())
                    .then(data => {
                        if (data.status === 'ok') {
                            if (data.correct_solution) {
                                this.$bvToast.toast(`پاسخ سوال قبل: ${data.correct_solution}`, {
                                        variant: 'info',
                                        solid: true
                                    }
                                );
                            }
                            this.$bvModal.hide('modal-new-problem')
                        } else {
                            this.$bvToast.toast(data.message, {
                                    variant: 'danger',
                                    solid: true
                                }
                            );
                        }
                        this.get_user();

                    });
            },
            submit_solution(solution) {
                fetch(siteUrl + '/problem/try', {
                    headers: {
                        'Authorization': 'Token ' + localStorage.getItem('login'),
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify({
                        'solution': solution
                    }),
                    method: 'POST',
                }).then(x => x.json())
                    .then(data => {
                        if (data.status === 'ok') {
                            if (data.result === 'accept') {
                                this.$bvToast.toast('درست بود!', {
                                        variant: 'success',
                                        solid: true
                                    }
                                );
                            } else {
                                this.$bvToast.toast('غلط بود!', {
                                        variant: 'danger',
                                        solid: true
                                    }
                                );
                            }
                            this.get_user();
                        }
                    });
            },
            get_hint() {
                fetch(siteUrl + '/problem/hint', {
                    headers: {
                        'Authorization': 'Token ' + localStorage.getItem('login')
                    }
                }).then(x => x.json())
                    .then(data => {
                        if (data.status === 'ok') {
                            this.get_user();
                        } else {
                            this.$bvToast.toast(data.message, {
                                    variant: 'danger',
                                    solid: true
                                }
                            );
                        }
                    });
            },
            get_reward(event) {
                event.preventDefault();
                fetch(siteUrl + '/reward_code', {
                    headers: {
                        'Authorization': 'Token ' + localStorage.getItem('login'),
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify({
                        'code': this.reward_code
                    }),
                    method: 'POST',
                }).then(x => x.json())
                    .then(data => {
                        if (data.status === 'ok') {
                            this.$bvToast.toast(data.message, {
                                    variant: 'success',
                                    solid: true
                                }
                            );
                            this.$bvModal.hide('modal-reward-code')
                            this.get_user();
                        } else {
                            this.$bvToast.toast(data.message, {
                                    variant: 'danger',
                                    solid: true
                                }
                            );
                        }
                    });
            },
            logout() {
                localStorage.removeItem('login');
                this.$router.push('/login')
            }
        }
    }
</script>

<style scoped>

</style>
