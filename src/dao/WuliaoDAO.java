package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import com.alibaba.fastjson.JSON;

import entity.Wuliao;
import util.DBHelper;

//分公司业务逻辑类
public class WuliaoDAO {
	
	//获取所有分公司的信息
	public static ArrayList<Wuliao> getAllCompanys(){
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		ArrayList<Wuliao> list = new ArrayList<Wuliao>(); // 公司集合
		
		try {
			conn = DBHelper.getConnection();
			String sql = "select * from wuliao;";
			stmt = conn.prepareStatement(sql);
			rs = stmt.executeQuery();
			while(rs.next()){
				Wuliao wuliao = new Wuliao();
				wuliao.setId(rs.getInt("id"));
				wuliao.setWuliaobianma(rs.getInt("wuliaobianma"));
				wuliao.setName(rs.getString("name"));
				list.add(wuliao);//把一个公司加入集合
			}
			System.out.println(JSON.toJSON(list));
			return list; //返回集合
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} finally {
			//释放数据集对象
			if(rs != null){
				try {
					rs.close();
					rs = null;
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
			//释放语句对象
			if(stmt != null) {
				try {
					stmt.close();
					stmt = null;
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
		}
	}
}
