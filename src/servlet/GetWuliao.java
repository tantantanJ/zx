package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import dao.TableDAO;
import entity.Wuliao;

@SuppressWarnings("serial")
public class GetWuliao extends HttpServlet {

	@SuppressWarnings("static-access")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	        request.setCharacterEncoding("utf-8");
	        response.setCharacterEncoding("utf-8");
			
	        PrintWriter out = response.getWriter();
	        
	        TableDAO tableDao = new TableDAO();
			ArrayList<Wuliao> list = tableDao.getAllWuliao();
	        
	        out.println( "{\"status\":\"OK\", \"hasData\":\"TRUE\", \"rows\":" + JSON.toJSON(list) +"}");
	        
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
