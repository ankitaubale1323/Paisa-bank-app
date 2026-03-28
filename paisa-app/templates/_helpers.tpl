{{/*
paisa-bank-app Helm Chart helpers
*/}}

{{- define "paisa-bank-app.name" -}}
{{- .Chart.Name }}
{{- end }}

{{- define "paisa-bank-app.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "paisa-bank-app.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
MongoDB connection URI — built from secret values so it stays consistent
*/}}
{{- define "paisa-bank-app.mongoUri" -}}
mongodb://{{ .Values.secrets.mongoRootUsername }}:{{ .Values.secrets.mongoRootPassword }}@mongodb-service:{{ .Values.mongodb.service.port }}/{{ .Values.mongodb.database }}?authSource=admin
{{- end }}
