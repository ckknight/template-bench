{% extends "inheritance-layout.swig" %}

{% block body %}
	<h1>{{ text|raw }}</h1>
  {% if items.length %}
    <dl id="items">
      {% for item in items %}
        <dt><a href="{{ item.url|raw }}">{{ item.name|raw }}</a>: ${{ item.price|nicePrice|raw }}</dt>
        <dd><p>{{ item.description|raw }}</p></dd>
  		{% endfor %}
    </dl>
  {% else %}
    <p id="no-items">There are no items at this time.</p>
  {% endif %}
{% endblock %}