package com.mommyshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import java.io.File;

@Service
public class UploadService {

    @Autowired
    ServletContext app;

    public File save(MultipartFile file, String folder) {
        File dir = new File(app.getRealPath("/assets/" + folder));
        if (!dir.exists()) {
            dir.mkdirs();
        }
        String s = System.currentTimeMillis() + file.getOriginalFilename();
        String name = Integer.toHexString(s.hashCode()) + s.substring(s.lastIndexOf("."));
        try {
            File savedFile = new File(dir, name);
            file.transferTo(savedFile);
            System.out.println(savedFile.getAbsolutePath());
            return savedFile;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void delete(String name, String folder) {


        try {
            File dir = new File(app.getRealPath("/assets/" + folder + "/" + name));
            System.out.println(dir);
            if (dir.delete()) {
                System.out.println(dir.getName() + " is deleted!");
            } else {
                System.out.println("Sorry, unable to delete the file.");
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
