<template>
    <div>
        <b-alert show>امتیاز: {{user.score}}</b-alert>
        <b-alert show>اعضای تیم <ul :key="member" v-for="member in team_members">
            <li>{{member}}</li>
        </ul></b-alert>
    </div>
</template>

<script>
export default {
  name: 'User',
  props: {
    user: Object
  },
  computed: {
      team_members() {
          if(this.user == null)
              return [];
          return this.user.team_members.split('\n')
      }
  }
}
</script>
