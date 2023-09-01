package com.mommyshop.mail;

import com.mommyshop.entity.MailInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;


@Service
public class MailService {

    @Autowired
    private JavaMailSender sender;
    
    @Autowired
    private TemplateEngine templateEngine;
    
    public void send(MailInfo mail) throws MessagingException {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
        helper.setFrom(mail.getFrom());
        helper.setTo(mail.getTo());
        helper.setSubject(mail.getSubject());
        
        // Đọc file HTML và CSS
        //ClassPathResource htmlResource = new ClassPathResource("/templates/new-email.html");
        //ClassPathResource cssResource = new ClassPathResource("email_style.css");
        
        Context context = new Context();
        context.setVariable("confirmationCode",mail.getCode()); // Gửi confirmation code
        //context.setVariable("name",mail.getName()); // Gửi name
        String htmlContent = templateEngine.process("new-email2.html", context);
        //String htmlContent1 = templateEngine.process(htmlContent, context);
        helper.setReplyTo(mail.getFrom());
        helper.setText(htmlContent, true);
        // Đính kèm hình ảnh (vd: logo.png)
        helper.addInline("1_FPT_Polytechnic.png", new ClassPathResource("static/assets/images/FPT_Polytechnic.png"));
//        helper.addInline("3_logo.png", new ClassPathResource("static/assets/images/logo.png"));
//        helper.addInline("2_banner-1.png", new ClassPathResource("static/assets/images/banner-1.png"));
//        helper.addInline("4_favicon.ico", new ClassPathResource("static/assets/images/favicon.ico"));
        String[] cc = mail.getCc();
        if (cc != null && cc.length > 0) {
            helper.setCc(cc);
        }
        String[] bcc = mail.getBcc();
        if (bcc != null && bcc.length > 0) {
            helper.setBcc(bcc);
        }
        String[] attachments = mail.getAttachments();
        if (attachments != null) {
            for (String path : attachments) {
                File file = new File(path);
                helper.addAttachment(file.getName(), file);
            }
        }
        
        sender.send(message);
    }

    public void send(String to, String subject, String body, String code, String name) throws MessagingException {
        this.send(new MailInfo(to, subject, body, code, name));
    }

    List<MailInfo> queue = new ArrayList<>();

    public void queue(MailInfo mail) {
        queue.add(mail);
    }

    public void queue(String to, String subject, String body, String code, String name) {
        queue(new MailInfo(to, subject, body, code, name));
    }

    @Scheduled(fixedDelay = 5000)
    public void run() {
        while (!queue.isEmpty()) {
            MailInfo mail = queue.remove(0);
            try {
                send(mail);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


}
