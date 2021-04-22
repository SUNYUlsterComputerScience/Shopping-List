<%@ page contentType="text/html;charset=UTF-8"%>
<html>
<head>
    <title>Shopping List Login Template</title>
</head>
<body>
<h1>Shopping List Login Template</h1>
<p>Welcome to the Shopping List Login Template</p>
<p>You are currently authenticated!</p>
<!-- tag::username[] -->
<p>Hello, ${username}</p>
<!-- end::username[] -->
<!-- tag::logout[] -->
<form method="post" action="logout">
    <!-- tag::btnLogout[] -->
    <button type="submit">Log out</button>
    <!-- end::btnLogout -->
</form>
<!-- end::logout[] -->
</body>
</html>
