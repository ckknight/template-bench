<!DOCTYPE html>
<html lang="en-us">
	<head>
		<title>{{ title }}</title>
	</head>
	<body>
		<h1>{{ text }}</h1>
    {% if items.length %}
      <dl id="items">
        {% for item in items %}
          <dt><a href="{{ item.url }}">{{ item.name }}</a>: ${{ item.price|nicePrice }}</dt>
          <dd><p>{{ item.description }}</p></dd>
    		{% endfor %}
      </dl>
    {% else %}
      <p id="no-items">There are no items at this time.</p>
    {% endif %}
	</body>
</html>
