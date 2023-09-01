package com.mommyshop.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MailInfo {
    private String from;
    private String to;
    private String[] cc;
    private String[] bcc;
    private String subject;
    private String body;
    private String code;
    private String name;
    private String[] attachments;

    public MailInfo(String to, String subject, String body, String code, String name) {
        this.from = "hello";
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.code = code;
        this.name = name;
    }
}
