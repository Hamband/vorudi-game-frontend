<template>
    <div v-if="problem">
        <b-card
                :title="'سوال کنونی: (سطح: ' + problem.category.name + ')'"
        >
            <b-card-text>
                {{problem.statement}}
                <div v-if="hint">
                    <strong>راهنمایی: </strong> {{ hint }}
                </div>
                <div v-else>
                    <b-button @click="get_hint" variant="warning">گرفتن راهنمایی</b-button>
                </div>
            </b-card-text>
            <b-form @submit="doSubmit">
                <b-form-input type="‌text" v-model="solution" placeholder="جواب"></b-form-input>
                <br>
                <b-button type="submit" variant="primary" block>ثبت جواب</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: "CurrentProblem",
        props: {
            problem: Object,
            hint: Object
        },
        data() {
            return {
                solution: '',
            };
        },
        methods: {
            doSubmit(event) {
                event.preventDefault();
                this.$emit('submit', this.solution);
            },
            get_hint() {
                this.$emit('get_hint')
            }
        }
    }
</script>

<style scoped>

</style>