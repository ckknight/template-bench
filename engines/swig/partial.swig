<!DOCTYPE html>
<html lang="en-us">
	<head>
		<title>{{ title|raw }}</title>
	</head>
	<body>
		<h1>{{ text|raw }}</h1>
    {% if items.length %}
      <dl id="items">
        {% for item in items %}
          {% include "_item.swig" with item %}
    		{% endfor %}
      </dl>
    {% else %}
      <p id="no-items">There are no items at this time.</p>
    {% endif %}
	</body>
</html>
