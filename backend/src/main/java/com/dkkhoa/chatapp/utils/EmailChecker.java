package com.dkkhoa.chatapp.utils;

import java.util.regex.Pattern;

public class EmailChecker {
    public static boolean patternMatches(String emailAddress) {
        return Pattern.compile("^(.+)@(\\S+)$")
                .matcher(emailAddress)
                .matches();
    }
}
