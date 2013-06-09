{% extends "inheritance-layout.swig" %}

{% block body %}
	<h1>{{ text|raw }}</h1>
  {% block content %}
  {% endblock %}
{% endblock %}