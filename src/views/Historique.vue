<template>
  <v-container>
    <v-card>
      <v-card-title>Historique</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-timeline side="end" align="start" height="90vh" class="overflow-y-auto">
              <v-timeline-item
                v-for="historique in historiques"
                :key="historique.id"
                :dot-color="getHistoriqueType(historique.type)?.color"
                size="small"
              >
                <div class="d-flex">
                  <div>
                    <strong class="me-4">{{ historique.realised_at }}</strong>
                    <v-chip label :color="getHistoriqueType(historique.type)?.color">{{ getHistoriqueType(historique.type)?.label }}</v-chip>
                    <div class="text-caption">
                      <v-alert class="my-2">{{ historique.description }}</v-alert>
                      <div>
                        <v-chip class="ma-1">{{historique.admin?.name}}</v-chip>
                        <v-chip class="ma-1">{{historique.employee?.name}}</v-chip>
                        <v-chip class="ma-1">{{historique.company?.name}}</v-chip>
                      </div>
                    </div>
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import {getHistoriqueType} from "../utils";
import axios from "@/services/axios.service";

export default {
  mounted() {
    this.getHistoric();
  },
  methods: {
    getHistoriqueType,
    async getHistoric() {
      let url = "api/historics";
      await axios.get(url).then(
        (response) => {
          this.historiques = response.data
        }
      )
    },
  },
  data() {
    return {
      historiques: [
      ]
    }
  },
};
</script>
