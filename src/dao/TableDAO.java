package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import com.alibaba.fastjson.JSON;

import entity.Fadianliangluru;
import entity.Wuliao;
import util.DBHelper;

public class TableDAO {
	
	//获取发电量录入单明细
	public static ArrayList<Fadianliangluru> getAllFadianliangluru(){
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		ArrayList<Fadianliangluru> list = new ArrayList<>();
		
		try {
			conn = DBHelper.getConnection();
			String sql = "SELECT a.id ,a.danjubianhao,a.companyid,a.departmentid,a.lururenid,a.create_time,a.wuliaobianma,a.fadianliang,a.danjia,a.jine,b.name as personname,c.name as departmentname,d.name as companyname,e.name as wuliaomingcheng FROM fadianliangluru a left join person b on a.lururenid = b.id left join department c on a.companyid=c.companyid&&a.departmentid=c.id left join company d on d.id=a.companyid left join wuliao e on e.wuliaobianma=a.wuliaobianma;";
			stmt = conn.prepareStatement(sql);
			rs = stmt.executeQuery();
			while(rs.next()){
				Fadianliangluru fadianliangluru = new Fadianliangluru();
				fadianliangluru.setId(rs.getInt("id"));
				fadianliangluru.setDanjubianhao(rs.getInt("danjubianhao"));
				fadianliangluru.setCompanyid(rs.getInt("companyid"));
				fadianliangluru.setDepartmentid(rs.getInt("departmentid"));
				fadianliangluru.setLururenid(rs.getInt("lururenid"));
				fadianliangluru.setCreate_time(rs.getString("create_time"));
				fadianliangluru.setWuliaobianma(rs.getInt("wuliaobianma"));
				fadianliangluru.setFadianliang(rs.getInt("fadianliang"));
				fadianliangluru.setDanjia(rs.getFloat("danjia"));
				fadianliangluru.setJine(rs.getFloat("jine"));
				fadianliangluru.setPersonname(rs.getString("personname"));
				fadianliangluru.setDepartmentname(rs.getString("departmentname"));
				fadianliangluru.setCompanyname(rs.getString("companyname"));
				fadianliangluru.setWuliaomingcheng(rs.getString("wuliaomingcheng"));
				list.add(fadianliangluru);//把一个公司加入集合
			}
			System.out.println(JSON.toJSON(list));
			return list; //返回集合
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}
	
	//获取物料及编码
	public static ArrayList<Wuliao> getAllWuliao(){
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
