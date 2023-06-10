package com.mommyshop.interceptor;

import com.mommyshop.service.AccountService;
import com.mommyshop.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
@RequiredArgsConstructor
public class GlobalInterceptor implements HandlerInterceptor {
    private final AccountService accountService;
    private final FavoriteService favoriteService;

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {
        String email = request.getRemoteUser();
        
    }
}
