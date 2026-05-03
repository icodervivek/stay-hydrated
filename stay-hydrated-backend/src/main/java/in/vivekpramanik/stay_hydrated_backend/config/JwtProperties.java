package in.vivekpramanik.stay_hydrated_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

	private String secret;
	private long accessTokenExpiryMs;
	private int refreshTokenExpiryDays;

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public long getAccessTokenExpiryMs() {
		return accessTokenExpiryMs;
	}

	public void setAccessTokenExpiryMs(long accessTokenExpiryMs) {
		this.accessTokenExpiryMs = accessTokenExpiryMs;
	}

	public int getRefreshTokenExpiryDays() {
		return refreshTokenExpiryDays;
	}

	public void setRefreshTokenExpiryDays(int refreshTokenExpiryDays) {
		this.refreshTokenExpiryDays = refreshTokenExpiryDays;
	}
}
