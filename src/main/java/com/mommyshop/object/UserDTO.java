package com.mommyshop.object;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
	@NotBlank(message = " Bạn phải nhập email!")
	private String email;

	@NotBlank(message = " Bạn Phải nhập Họ và Tên!")
	private String fullname;
	@Pattern(regexp =  "^(0|\\+84)(\\s|\\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\\d)(\\s|\\.)?(\\d{3})(\\s|\\.)?(\\d{3})$",message="Bạn phải nhập đúng định dạng !") 
	@NotBlank(message = " Bạn Phải nhập Số điện thoại!")
	private String phoneNumber;

	@NotBlank(message = " Bạn Phải nhập mật khẩu!")
	private String password;

	@NotBlank(message = "Bạn Phải nhập lại mật khẩu!")
	private String rpassword;

	private String photo;

}