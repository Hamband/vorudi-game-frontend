<template>
    <b-container>
        <h1 :style="{textAlign:'center'}">بازی جشن!</h1>
        <b-button block to="/">
            بازگشت به صفحه اصلی
        </b-button>
        <b-table striped hover :items="teams" :fields="fields"></b-table>
    </b-container>

</template>

<script>
    import {siteUrl} from "../const";

    export default {
        name: 'Scoreboard',
        data() {
            return {
                teams: [],
                fields: [
                    {
                        key: 'rank',
                        label: 'رتبه'
                    },
                    {
                        key: 'team_members',
                        label: 'اعضای تیم',
                        sortable: true
                    },
                    {
                        key: 'score',
                        label: 'امتیاز',
                        sortable: true,
                    }
                ]
            }
        },
        created() {
            fetch(siteUrl + '/scoreboard', {
                'method': 'GET'
            }).then(x => x.json())
                .then(data => {
                    this.teams = data.teams;
                })
        }
    }
</script>

<style scoped>

</style>
