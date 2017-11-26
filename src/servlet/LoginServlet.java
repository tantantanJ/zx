package servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class LoginServlet extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		if(username.equals("admin")&&password.equals("123")){
			response.sendRedirect(request.getContextPath()+"/mainpage.html?id=admin");
		} else if(username.equals("yonghu")&&password.equals("123")){
			response.sendRedirect(request.getContextPath()+"/mainpage.html?id=yonghu");
		}else{
			response.sendRedirect(request.getContextPath()+"/login_failure.html");
		}
	}

}
